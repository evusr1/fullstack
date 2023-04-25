import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
        <IconButton onClick={toggleVisibility} size="large">
          {props.buttonLabel}
        </IconButton>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <IconButton onClick={toggleVisibility} size="large">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
});

PropTypes.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
