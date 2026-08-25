import { expect } from "chai";
import { Channel, NotificationManager } from "@webresto/core/libs/NotificationManager";
import { NotificationDispatcher } from "@webresto/core/libs/NotificationDispatcher";

/**
 * Covers Channel.stopEscalation end to end against the real dispatcher, with the Waterline
 * globals stubbed in memory. The core integration suite needs its own lifted fixture app
 * (test/fixture), which is not installed here.
 */
class StubChannel extends Channel {
  public forceSend = false;
  public forGroupTo = ["user"];
  public sortOrder: number;
  public cost = 0;
  public type: string;
  public sendCount = 0;

  constructor(type: string, sortOrder: number) {
    super();
    this.type = type;
    this.sortOrder = sortOrder;
  }

  protected async send(): Promise<void> {
    this.sendCount += 1;
  }
}

/** Minimal chainable query stub: `.sort().limit()` and direct await both work. */
function query<T>(rows: T[]): any {
  const promise: any = Promise.resolve(rows);
  promise.sort = () => query(rows);
  promise.limit = (count: number) => query(rows.slice(0, count));
  promise.populate = () => query(rows);
  return promise;
}

describe("notification delivery > terminal channel (stopEscalation)", () => {
  const globals = globalThis as any;
  const mockedGlobals = ["sails", "Notification", "Settings", "User", "emitter"] as const;
  let savedGlobals: Record<string, any>;
  let channelsBackup: Channel[];
  let store: Map<string, any>;
  let terminal: StubChannel;
  let paid: StubChannel;
  let logs: string[];

  const insert = (values: any) => {
    const id = `notification-${store.size + 1}`;
    const record = { id, status: "pending", channels: [], spentCost: 0, deliveryAttempts: 0, escalationExhausted: false, ...values };
    store.set(id, record);
    return record;
  };

  beforeEach(() => {
    store = new Map();
    logs = [];
    terminal = new StubChannel("stub-terminal", 1);
    paid = new StubChannel("stub-paid", 2);
    terminal.stopEscalation = true;

    channelsBackup = [...NotificationManager.channels];
    NotificationManager.channels.length = 0;
    NotificationManager.channels.push(terminal, paid);

    savedGlobals = {};
    for (const key of mockedGlobals) savedGlobals[key] = globals[key];

    globals.sails = { log: { error() {}, warn() {}, info() {}, verbose() {}, debug() {}, silly() {} } };
    globals.Settings = { get: async () => undefined, set: async () => undefined, setDeclaredSetting() {} };
    globals.User = { findOne: async ({ id }: any) => ({ id, login: id }) };
    globals.emitter = { emit: async () => undefined, on: () => undefined };
    globals.Notification = {
      create: (values: any) => ({ fetch: async () => insert(values) }),
      updateOne: (criteria: any) => ({
        set: async (values: any) => {
          const record = store.get(criteria.id);
          if (!record) return undefined;
          // The dispatcher's atomic claim passes the expected status in the criteria.
          if (criteria.status !== undefined && record.status !== criteria.status) return undefined;
          Object.assign(record, values, { updatedAt: Date.now() });
          return record;
        },
      }),
      findOne: async ({ id }: any) => store.get(id),
      find: () => query([]),
      log: async (_criteria: any, _level: string, _module: string, message: string) => { logs.push(message); },
    };
  });

  afterEach(() => {
    NotificationManager.channels.length = 0;
    NotificationManager.channels.push(...channelsBackup);
    for (const key of mockedGlobals) {
      if (savedGlobals[key] === undefined) delete globals[key];
      else globals[key] = savedGlobals[key];
    }
  });

  it("closes the record for escalation as soon as a terminal channel delivers it", async () => {
    const notification = await NotificationDispatcher.send({
      user: "user-1",
      title: "Order status",
      body: "Order 42 is on the way",
    });

    expect(notification.status).to.equal("sent");
    expect(terminal.sendCount).to.equal(1);
    expect(paid.sendCount).to.equal(0);
    expect(notification.escalationExhausted).to.equal(true);
    expect(logs.join(" ")).to.contain("escalation stopped by terminal channel");
  });

  it("does not spend a further channel on a message already delivered to a messenger", async () => {
    const record = insert({
      user: "user-1",
      title: "Order status",
      body: "Order 42 is on the way",
      groupTo: "user",
      status: "sent",
      channels: [{ type: "stub-terminal", cost: 0, sentAt: Date.now() }],
      deliveryAttempts: 1,
    });

    await NotificationDispatcher._deliverNextChannel(record as any);

    expect(store.get(record.id).escalationExhausted).to.equal(true);
    expect(paid.sendCount).to.equal(0);
  });

  it("still escalates when the delivering channel is not terminal", async () => {
    terminal.stopEscalation = false;
    const record = insert({
      user: "user-1",
      title: "Order status",
      body: "Order 42 is on the way",
      groupTo: "user",
      status: "sent",
      channels: [{ type: "stub-terminal", cost: 0, sentAt: Date.now() }],
      deliveryAttempts: 1,
    });

    await NotificationDispatcher._deliverNextChannel(record as any);

    expect(paid.sendCount).to.equal(1);
    expect(store.get(record.id).escalationExhausted).to.equal(false);
  });

  it("keeps the terminal flag in the persisted channel state", async () => {
    const state: Record<string, any> = {};
    globals.Settings = {
      get: async (key: string) => state[key],
      set: async (key: string, value: any) => { state[key] = value?.value ?? value; },
      setDeclaredSetting() {},
    };

    await NotificationManager.setChannelSettings("stub-paid", { stopEscalation: true });
    expect(paid.isStopEscalation()).to.equal(true);

    const persisted = state[NotificationManager.channelsStateSettingKey];
    expect(persisted["stub-paid"].stopEscalation).to.equal(true);
    expect(persisted["stub-terminal"].stopEscalation).to.equal(true);

    // A reload of the persisted state must restore the operator's choice.
    paid.setStopEscalation(false);
    await NotificationManager.loadChannelsState();
    expect(paid.isStopEscalation()).to.equal(true);
  });
});
