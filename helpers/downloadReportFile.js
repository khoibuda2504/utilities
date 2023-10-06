import { downloadFile } from "~/state/utils/downloadFile";
import { isNil } from "lodash";
import { parseObjToQuery } from "~/views/utilities/helpers";
import { generateSearchOrFilter } from "~/views/utilities/helpers/utilURLParams";

const getPlainText = (label) => {
  let plainText = undefined;
  if (typeof label === "object") {
    plainText = label.props.children.props.values.text
      ? `${label.props.children.props.values.text} ${label.props.children.props.values.value}`
      : label.props.children.props.defaultMessage;
  } else {
    plainText = label;
  }
  return plainText;
};

export const handleExportExcel = (
  exportExcelApi,
  filterOrSearchParams,
  exportFileName,
  columns,
  instance = "report",
) => {
  const displayColumns = columns
    .map((col) => ({
      title: getPlainText(col.title),
      field: col.dataIndex,
    }))
    .filter((item) => !isNil(item.field));
  const params = filterOrSearchParams?.extendFilters
    ? generateSearchOrFilter(filterOrSearchParams)
    : { filters: filterOrSearchParams };
  downloadFile({
    url: "/common/export-excel",
    filename: exportFileName + ".xlsx",
    body: {
      url: `${exportExcelApi}${parseObjToQuery(params)}`,
      exportFields: displayColumns,
      instance: instance,
    },
  });
};
