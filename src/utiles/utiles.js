import moment from 'moment';
import { CSVLink } from 'react-csv';
import Button from '@mui/material/Button'

export const formatDate = (value) => {
  moment.locale('en-US');
  return moment(value).format('DD MMMM YYYY, h:mm A');
};

export const getOnlyTime = (value) => {
  moment.locale('en-US');
  return moment(value).format('h:mm A');  
};

export const formatDateWithOutTime = (value) => {
  moment.locale('en-US');
  return moment(value).format('DD MMMM YYYY');
};
export const formatYYYYMMDD = (value) => {
  moment.locale('en-US');
  return moment(value).format('YYYY-MM-DD');
};
export const formatDDMMYYYY = (value) => {
  moment.locale('en-US');
  return moment(value).format('DD-MM-YYYY');
};

export const ExportToExcel = ({data})=> {
  const transform = (value, header) => {
    if (header === additionalColumn.header) {
      return additionalColumn.value;
    }
    return value;
  };
  return(
    <>
    {data?.length > 0 &&
    <CSVLink data={data} filename="data.csv">
      <Button variant="outlined" color="primary">
         Export to Excel
      </Button>  
    </CSVLink>
    }
    </>
  )
}