const Service = use("App/Models/Service");

class ServiceRepository {
  static async update(sid, data) {
    const service = await Service.findOrFail(sid);
    service.merge(data);
    await service.save();
    return service;
  }
}

module.exports = ServiceRepository;
