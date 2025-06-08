import PropTypes from "prop-types";

export const intelligentTableColumnColorsArray = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      color: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ])
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
  schoolName: PropTypes.string,
  summaryTitle: PropTypes.string,
  instructions: PropTypes.string,
  loading: PropTypes.bool,
  pagination: PropTypes.bool,
  stickyHeader: PropTypes.bool,
  enableLegends: PropTypes.bool,
  enableSummary: PropTypes.bool,
  enableScroll: PropTypes.bool,
  enableCopy: PropTypes.bool,
};
