const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const formData = require("./data/data.json");

const dataToSchema = (data) => {
  const types = {
    textField: Joi.string(),
    richText: Joi.string(),
  };

  return Joi.object(
    data._children.reduce((acc, field) => {
      const props = field._properties;
      let fieldSchema = types[field._type] || Joi.string();

      if (props._mandatory) {
        fieldSchema = fieldSchema.required();
      }

      if (!props._editable) {
        fieldSchema = fieldSchema.valid(props._value);
      }

      if (props._max_value) {
        fieldSchema = fieldSchema.max(props._max_value);
      }

      acc[field._name] = fieldSchema;
      return acc;
    }, {})
  );
};

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/form/data", (req, res) => {
  res.header("Content-type", "application/json");
  res.status(200).send(JSON.stringify(formData));
});

app.post("/api/form", (req, res) => {
  const validation = dataToSchema(formData).validate(req.body || {}, {
    abortEarly: false,
  });
  if (validation.error) {
    res.status(400).send(JSON.stringify({ error: validation.error }));
  } else {
    res.header("Content-type", "application/json");
    res
      .status(200)
      .send(
        JSON.stringify({
          redirect_url: formData._children.filter(
            (child) => child?._name === "submit"
          )[0]?._properties?._value,
          message: "Valid form",
        })
      );
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
