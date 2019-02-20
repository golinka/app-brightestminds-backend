const WoodpeckerAPI = require("woodpecker-api");

const Service = use("App/Models/Service");

class ServiceRepository {
  static async update(sid, data) {
    const service = await Service.findOrFail(sid);
    service.merge(data);
    await service.save();
    return service;
  }

  static async getCampaignsStat(token) {
    const Woodpecker = WoodpeckerAPI(token);
    const response = await Woodpecker.campaigns().find();
    return response;
  }
}

module.exports = ServiceRepository;
