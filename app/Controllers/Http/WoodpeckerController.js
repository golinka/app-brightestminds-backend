const Service = use("App/Models/Service");

class WoodpeckerController {
  async getServiceToken(user) {
    const { rows: [woodpecker] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpecker.toJSON().pivot;
    return token;
  }

  async campaigns({ auth }) {
    const user = await auth.getUser();
    const token = await this.getServiceToken(user);
    return Service.getCampaigns(token);
  }

  async campaign({ params, auth }) {
    const { cid } = params;
    const user = await auth.getUser();
    const token = await this.getServiceToken(user);
    return Service.getCampaign(cid, token);
  }

  async prospects({ params, auth }) {
    const { cid } = params;
    const user = await auth.getUser();
    const token = await this.getServiceToken(user);
    return Service.getProspects(cid, token);
  }

  async opened({ params, auth }) {
    const { cid } = params;
    const user = await auth.getUser();
    const token = await this.getServiceToken(user);
    return Service.getOpened(cid, token);
  }
}

module.exports = WoodpeckerController;
