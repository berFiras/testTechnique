import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFormBuilder,
  submitForm,
  PENDING,
  SUCCESS,
  ERROR,
} from "./formBuilderReducer.slice";

import "./styles.css";

const dic = {
  textField: "input",
  buttonField: "button",
  richText: "textarea",
};

const toHtmlProperties = {
  _mondatory: "required",
  _max_value: "max",
  _value: "defaultValue",
  _name: "name",
};

const normalize = (properties) => {
  const keys = Object.keys(properties);
  return keys.reduce((acc, item) => {
    if (toHtmlProperties[item]) {
      acc[toHtmlProperties[item]] = properties[item];
    }
    return acc;
  }, {});
};

export default function App() {
  const dispatch = useDispatch();
  const [addFormStatus, setAddFormStatus] = useState("idle");
  const { loading, data } = useSelector((state) => state.formBuilder);

  useEffect(() => {
    dispatch(fetchFormBuilder());
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    setAddFormStatus("pending");
    const values = Array.from(e.target).reduce((acc, v) => {
      if (v.name) {
        acc[v.name] = v.value;
      }
      return acc;
    }, {});

    const data = await submitForm(values);
    console.log(data);
    if (!data.error) {
      document.location.replace(data?.redirect_url);
    } else {
      const errorMessage = document.getElementById("error_message");

      while (errorMessage.firstChild) {
        errorMessage.removeChild(errorMessage.firstChild);
      }

      data.error.details.forEach((error) => {
        const newErrorMessage = document.createElement("span");
        newErrorMessage.innerHTML = error.message;
        console.log(newErrorMessage);
        errorMessage.appendChild(newErrorMessage);
      });
    }
    setAddFormStatus("idle");
  };

  return SUCCESS === PENDING ? (
    <h1>...loading</h1>
  ) : (
    <div className="App">
      <form onSubmit={handleClick}>
        <h1>{data?._title}</h1>
        <div id="error_message"></div>

        {data?._children?.map((input, index) => {
          const Comp = dic[input._type];
          const props = normalize(input._properties);
          const name = input?._name;
          return Comp === "button" ? (
            <button
              key={index}
              type="submit"
              disabled={addFormStatus === "pending"}
            >
              {addFormStatus === "pending" ? "in progress" : input._label}
            </button>
          ) : (
            <div key={index}>
              <label>{input._label}:</label>
              <Comp
                {...props}
                name={name}
                disabled={!input._properties._editable}
              />
            </div>
          );
        })}
      </form>
    </div>
  );
}
