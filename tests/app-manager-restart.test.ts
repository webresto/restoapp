import { expect } from "chai";

const SCHEDULER = require.resolve("../api/hooks/app-manager-proto/helpers/restartScheduler");

/**
 * The restart of the application: a line in the log and `process.exit(0)`, whatever supervises the
 * process brings it back. The scheduler keeps its state in a module variable, so each test takes a
 * fresh copy of it.
 */
describe("app-manager-proto: the restart scheduler", () => {
  const realExit = process.exit;
  const realLog = console.log;
  let exits: unknown[];
  let printed: string[];
  let scheduler: any;

  beforeEach(() => {
    exits = [];
    printed = [];
    (process as any).exit = (code: unknown) => exits.push(code);
    console.log = (...args: unknown[]) => printed.push(args.join(" "));
    delete require.cache[SCHEDULER];
    scheduler = require(SCHEDULER);
  });

  afterEach(() => {
    (process as any).exit = realExit;
    console.log = realLog;
    // The copy of this test must not be the one the module manager finds later in the same mocha process.
    delete require.cache[SCHEDULER];
  });

  /** A plan left behind would keep a timer to midnight in the process of the tests. */
  const cancelThePlan = async () => {
    scheduler.restartNow();
    await new Promise((resolve) => setTimeout(resolve, 1050));
  };

  it("has nothing going on at first", () => {
    expect(scheduler.getState()).to.deep.equal({ scheduled: false, scheduledFor: null, restarting: false });
  });

  it("plans for the next midnight, and planning twice is planning once", async () => {
    const first = scheduler.scheduleRestart();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    expect(first).to.deep.equal({ scheduled: true, scheduledFor: midnight.toISOString(), restarting: false });
    expect(scheduler.scheduleRestart()).to.deep.equal(first);
    expect(exits).to.deep.equal([]);
    await cancelThePlan();
  });

  it("restarting now says so at once, answers first, then prints and exits with zero", async () => {
    scheduler.restartNow();
    expect(scheduler.getState().restarting).to.equal(true);
    expect(exits, "the answer of the request goes out first").to.deep.equal([]);
    await new Promise((resolve) => setTimeout(resolve, 1050));
    expect(printed).to.deep.equal(["MM: restart: the process exits"]);
    expect(exits).to.deep.equal([0]);
  });

  it("an order overrules a plan: the process exits once", async () => {
    scheduler.scheduleRestart();
    await cancelThePlan();
    expect(exits).to.deep.equal([0]);
  });
});
