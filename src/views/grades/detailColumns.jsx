import {
  Box,
  Tooltip,
} from '@mui/material'

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const getColumns = () => {
  const handleTimeChange = (value) => {
    if(value){
    const selectedTime = value;
    const [hours, minutes] = selectedTime?.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const formattedDate = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return formattedDate;
  }
  return "-"
  };
  const coulmns = [
    {
      key: '1',
      title: "Day",
      dataIndex: "day",
    },
    {
      key: '2',
      title: "Start Time",
      render: (_, object) => handleTimeChange(object.startTime) || '-'
    },
    {
      key: '3',
      title: "Off Time",
      render: (_, object) => handleTimeChange(object.offTime) || '-'
    },
    {
      key: '7',
      title: "Status",
      width: "2%",
      render: (_, object) => {
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              minWidth: 150
            }}
          >
            <Tooltip title='Status'>
              {object?.isActive ?
                <CheckOutlined style={{ fontSize: 30, color: "green" }} /> :
                <CloseOutlined style={{ fontSize: 30, color: "red" }} />
              }
            </Tooltip>
          </Box>
        )
      },
      align: "center"
    },
  ]
  return coulmns;
}
export default getColumns;