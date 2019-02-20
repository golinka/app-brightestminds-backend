const Service = use("App/Models/Service");

class StatController {
  async campaigns({ auth }) {
    const user = await auth.getUser();
    const { rows: [woodpecker] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpecker.toJSON().pivot;
    return Service.getCampaigns(token);
  }
}

module.exports = StatController;
