import Class from "../../app/models/class.model";

export default (req, res) => {
  Class.findAll().then((data) => {
    res.send(data);
    res.status(200).json({ json: data });
  });
};

