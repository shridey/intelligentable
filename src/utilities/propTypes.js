import PropTypes from "prop-types";

export const intelligentTableColumnColorsArray = PropTypes.arrayOf(
  PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    color: PropTypes.string,
  })
);

export const intelligentTableColumnFiltersArray = PropTypes.arrayOf(
  PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    effect: PropTypes.bool,
  })
);

export const intelligentTableColumnsArray = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    dataIndex: PropTypes.string,
    operation: PropTypes.oneOf(["sum", "average", "count"]),
    color: intelligentTableColumnColorsArray,
    filter: intelligentTableColumnFiltersArray,
    sorted: PropTypes.oneOf(["asc", "desc"]),
  })
);

export const intelligentTablePropTypes = {
  columns: intelligentTableColumnsArray,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  pagination: PropTypes.bool,
  enableLegends: PropTypes.bool,
  summaryTitle: PropTypes.string,
  instructions: PropTypes.string,
  scrollY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  darkMode: PropTypes.bool,
  enableCopy: PropTypes.bool,
};
