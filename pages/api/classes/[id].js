import Class from "../../../database/models/class.model";

export default async function handler(req, res) {
  const id = req.query.id;
  Class.findOne({ where: { id: id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      console.log(error);
      res.error(error);
    });
}
