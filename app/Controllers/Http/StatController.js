const Service = use("App/Models/Service");

class StatController {
  async dashboard({ auth }) {
    const user = await auth.getUser();
    const { rows: [woodpeckerService] } = await user.services().where("slug", "woodpecker").fetch(); // eslint-disable-line
    const { token } = woodpeckerService.toJSON().pivot;
    return Service.getCampaigns(token);
  }
}

module.exports = StatController;
