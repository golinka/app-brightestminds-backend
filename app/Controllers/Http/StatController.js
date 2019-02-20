const Service = use("App/Models/Service");

class StatController {
  async campaigns({ auth }) {
    const user = await auth.getUser();
    const { rows: [woodpecker] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpecker.toJSON().pivot;
    return Service.getCampaigns(token);
  }

  async campaign({ params, auth }) {
    const { cid } = params;
    const user = await auth.getUser();
    const { rows: [woodpecker] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpecker.toJSON().pivot;
    return Service.getCampaign(cid, token);
  }

  async prospects({ params, auth }) {
    const { cid } = params;
    const user = await auth.getUser();
    const { rows: [woodpecker] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpecker.toJSON().pivot;
    return Service.getProspects(cid, token);
  }
}

module.exports = StatController;
