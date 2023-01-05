import React from "react";
import { Link } from "react-router-dom";

function DateButtons({ previous, today, next }) {
  return (
    <div className="btn-group" role="group" aria-label="navigation buttons">
      <Link className="btn btn-secondary" to={previous}>
        <span className="oi oi-chevron-left" />
        &nbsp;Previous
      </Link>
      <Link className="btn btn-secondary" to={today}>
        Today
      </Link>
      <Link className="btn btn-secondary" to={next}>
        Next&nbsp;
        <span className="oi oi-chevron-right" />
      </Link>
    </div>
  );
}

export default DateButtons;