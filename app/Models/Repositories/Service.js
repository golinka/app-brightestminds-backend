const WoodpeckerAPI = require("woodpecker-api");

const Service = use("App/Models/Service");

class ServiceRepository {
  static async update(sid, data) {
    const service = await Service.findOrFail(sid);
    service.merge(data);
    await service.save();
    return service;
  }

  static async getCampaigns(token) {
    const Woodpecker = WoodpeckerAPI(token);
    const campaigns = await Woodpecker.campaigns().find();
    const ids = campaigns.map(campaign => campaign.id);

    const statsArrays = await Promise.all(
      ids.map(id => Woodpecker.campaigns().find({ id }))
    );

    const stats = statsArrays.map(array => {
      const campaign = array.pop();
      delete campaign.stats.emails;
      return campaign;
    });

    return stats;
  }

  static async getCampaign(cid, token) {
    const Woodpecker = WoodpeckerAPI(token);
    const [campaign] = await Woodpecker.campaigns().find({ id: cid });
    return campaign;
  }

  static async getProspects(cid, token) {
    const Woodpecker = WoodpeckerAPI(token);
    const prospects = await Woodpecker.prospects().find({
      campaign: cid,
      $limit: 500
    });
    return prospects;
  }

  static async getOpened(cid, token) {
    const Woodpecker = WoodpeckerAPI(token);
    const prospects = await Woodpecker.prospects().find({
      activity: Woodpecker.activity.OPENED,
      campaign: cid,
      $limit: 500
    });
    return prospects;
  }

  static async getReplied(cid, token) {
    const Woodpecker = WoodpeckerAPI(token);
    const prospects = await Woodpecker.prospects().find({
      status: "REPLIED",
      campaign: cid,
      $limit: 500
    });
    return prospects;
  }
}

module.exports = ServiceRepository;
