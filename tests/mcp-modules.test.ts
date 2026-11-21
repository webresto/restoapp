import { expect } from "chai";

const register = require("../api/mcp/tools/modules");

class FakeRefusal extends Error {
  constructor(public reason: string, public status: number, message: string, public details: any = null) {
    super(message);
  }
}

/** The module manager as the tools see it: jobs that end when the test says so, and a scheduler. */
function fakes() {
  const calls: string[] = [];
  let finish: () => void = () => {};
  const job: any = { id: "job-1", kind: "update", appId: "admin-frontend", state: "running", log: [] };
  job.finished = new Promise<void>((resolve) => { finish = () => { job.state = "done"; resolve(); }; });
  const jobs = {
    ModuleRefusal: FakeRefusal,
    install: async (appId: string) => { calls.push(`install ${appId}`); return job; },
    update: async (appId: string) => {
      calls.push(`update ${appId}`);
      if (appId === "busy") throw new FakeRefusal("busy", 409, "Module x is already being updated");
      return job;
    },
    remove: async (appId: string) => { calls.push(`remove ${appId}`); return job; },
    get: (id: string) => (id === job.id ? job : null),
    view: (item: any) => { const { finished, ...plain } = item; return plain; },
  };
  const scheduler = {
    restartNow: () => calls.push("restartNow"),
    getState: () => ({ scheduled: true, scheduledFor: "2026-11-22T00:00:00.000Z", restarting: false }),
  };
  const tools = new Map<string, any>();
  register({ registerTool: (tool: any) => tools.set(tool.name, tool) }, { jobs: () => jobs, scheduler: () => scheduler });
  return { calls, job, finish: () => finish(), tools };
}

describe("MCP tools: module jobs", () => {
  it("registers install, update, remove and job, all protected", () => {
    const { tools } = fakes();
    expect([...tools.keys()]).to.deep.equal(["modules-install", "modules-update", "modules-remove", "modules-job"]);
    for (const tool of tools.values()) expect(tool.mode).to.equal("protected");
  });

  it("answers with the running job at once when not asked to wait", async () => {
    const { tools, calls } = fakes();
    const answer = await tools.get("modules-update").handler({ appId: " admin-frontend " });
    expect(calls).to.deep.equal(["update admin-frontend"]);
    expect(answer.job.state).to.equal("running");
    expect(answer.job).to.not.have.property("finished");
    expect(answer.restarting).to.equal(false);
  });

  it("waits for the end and restarts only after a success", async () => {
    const { tools, calls, finish } = fakes();
    setTimeout(finish, 20);
    const answer = await tools.get("modules-update").handler({ appId: "admin-frontend", wait: 5, restart: true });
    expect(answer.job.state).to.equal("done");
    expect(answer.restarting).to.equal(true);
    expect(calls).to.deep.equal(["update admin-frontend", "restartNow"]);
  });

  it("does not restart while the job is still running", async () => {
    const { tools, calls } = fakes();
    const answer = await tools.get("modules-install").handler({ appId: "base-pages", wait: 0, restart: true });
    expect(answer.restarting).to.equal(false);
    expect(calls).to.deep.equal(["install base-pages"]);
  });

  it("gives the refusal of the manager as an answer", async () => {
    const { tools } = fakes();
    const answer = await tools.get("modules-update").handler({ appId: "busy" });
    expect(answer).to.include({ refused: true, reason: "busy" });
  });

  it("removes only with confirm: true", async () => {
    const { tools, calls } = fakes();
    const refused = await tools.get("modules-remove").handler({ appId: "base-pages" });
    expect(refused).to.include({ refused: true, reason: "confirm" });
    expect(calls).to.deep.equal([]);
    await tools.get("modules-remove").handler({ appId: "base-pages", confirm: true });
    expect(calls).to.deep.equal(["remove base-pages"]);
  });

  it("reads a job by id, and says when a restart forgot it", async () => {
    const { tools } = fakes();
    expect((await tools.get("modules-job").handler({ id: "job-1" })).job.appId).to.equal("admin-frontend");
    expect(await tools.get("modules-job").handler({ id: "nope" })).to.include({ found: false });
  });
});
