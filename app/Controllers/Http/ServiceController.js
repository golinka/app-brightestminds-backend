const Service = use("App/Models/Service");

class ServiceController {
  async index() {
    return Service.all();
  }

  async store({ request }) {
    const data = request.only("name");
    return Service.create(data);
  }

  async show({ params }) {
    const { sid } = params;
    return Service.findOrFail(sid);
  }

  async update({ params, request }) {
    const { sid } = params;
    const data = request.only("name");
    return Service.update(sid, data);
  }

  async delete({ params, response }) {
    const { sid } = params;
    const service = await Service.findOrFail(sid);
    await service.delete();
    return response.status(204).send();
  }
}

module.exports = ServiceController;
