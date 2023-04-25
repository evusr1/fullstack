import { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} variant="secondary">
          cancel
        </Button>
      </div>
    </div>
  );
});

PropTypes.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
