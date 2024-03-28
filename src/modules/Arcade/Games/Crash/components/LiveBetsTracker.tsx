import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { decimals } from "@utils/validationHelper";
import icp from "../../../../../assets/images/icp.png";
import ckbtc from "../../../../../assets/images/ckBTC.png";
import vbt from "../../../../../assets/images/vbt.png";
import { useArcadeContext } from "@context/ArcadeContext";
import OpenChatFrame from "./OpenChatFrame";

interface Images {
  [key: string]: string | string;
}

const images: Images = { 'WICP': icp, 'CKBTC': ckbtc, 'VBT': vbt };

const maxProfits: Record<string, number> = {
  "CKBTC": 0.014,
  "WICP": 100,
  "VBT": 10000
}

type Chat = {
	path: string;
	title: string;
};

interface LiveBetsTrackerProps {
  liveBettingTable: any;
}

const tableCellStyle={
  color: '#D1D1D1',
  fontFamily: 'Poppins',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '22px',
  textTransform: 'uppercase' as const,
}

const tables = {
  livebet: 'livebet',
  chat: 'chat',
}

const LiveBetsTracker: React.FC<LiveBetsTrackerProps> = ({
  liveBettingTable,
}) => {
  const {currencyDetails} = useArcadeContext();
  
  const [currentTable, setCurrentTable] = useState(tables.livebet);

  const [crashChat] = useState<Chat>({
    path: "/community/5xqsl-6iaaa-aaaar-asnxq-cai/channel/298582077234531259897232625373948227574",
    title: "Chat",
  });

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{
          height: 280,
          marginTop: "30px",
          borderRadius: '16px 16px 0 0',
          backgroundColor: "#2e2e2e",
          "&::-webkit-scrollbar": {
            width: 5,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2e2e2e",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "white",
            borderRadius: 2,
            width: 10,
          },
        }}
      >
        <Table className="tabel_content">
          <TableHead sx={{ backgroundColor: 'rgba(46, 50, 58, 0.70)', color: "#D1D1D1", borderRadius: '16px 16px 0 0' }}>
            {currentTable === tables.livebet ? (
              <TableRow>
                <TableCell style={tableCellStyle}>User</TableCell>
                <TableCell style={tableCellStyle}>Bet Amount</TableCell>
                <TableCell style={tableCellStyle}>Multiplier</TableCell>
                <TableCell style={tableCellStyle}>Profit</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell style={{ 
                  ...tableCellStyle, 
                  textAlign: 'left',
                  top: '-1px',
                  position: 'sticky',
                  zIndex: '1000',
                  left: '0',
                  right: '0',
                  background: 'rgb(46, 50, 58)',
                }}>Chat</TableCell>
              </TableRow>
            )}
          </TableHead>
          {currentTable === tables.livebet ? (
            <TableBody>
              {liveBettingTable?.length > 0 &&
                liveBettingTable.map((bet: any, index: number) => (
                  <TableRow
                    key={bet.owner.toString()}
                    sx={
                      index % 2 === 0
                        ? { backgroundColor: "#111111" }
                        : { backgroundColor: "#2e2e2e" }
                    }
                  >
                    <TableCell sx={{ color: "white" }}>
                      {bet.owner.toString().substring(0, 5)}
                    </TableCell>
                    <TableCell sx={{ minWidth: '15px' }}>
                      <img
                        src={images[Object.keys(bet.token)[0]]}
                        alt={`Option ${Object.keys(bet.token)[0]}`}
                        style={{
                          minHeight: '15px', // Set the minimum height
                          maxHeight: '30px', // Set the maximum height
                          width: 'auto', // Let the width adjust automatically to maintain aspect ratio
                        }}
                      />
                      <span>
                        {`${Number(Object.values(bet.token)[0]) / decimals}`}
                      </span>
                    </TableCell>
                    <TableCell sx={{ color: "#00AA25" }}>
                      {Number(bet.multiplier ? Number(bet.multiplier).toFixed(2) : "--")}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {bet.isCashout
                        ? Math.min(
                          ((Number(Object.values(bet.token)[0]) / decimals) * Number(bet.multiplier)),
                          maxProfits[Object.keys(bet.token)[0]]
                        ).toPrecision(currencyDetails.precision)
                        : "--"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          ) : (
            <div className="oc-container">
              <OpenChatFrame {...crashChat} />
            </div>
          )}
        </Table>
      </TableContainer>
      <div style={{
        backgroundColor: '#2E323A',
        padding: '12px 24px',
        textAlign: 'left',
        borderRadius: '0 0 16px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
      }}>
        <div style={{
          display: 'flex',
        }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
            }}
            onClick={() => setCurrentTable(tables.livebet)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                backgroundColor: tables.livebet === currentTable ? '#66E094' : 'rgba(26, 26, 29, 0.80)',
                borderRadius: '4px 0px 0px 4px',
                padding: '4px',
              }}
            >
              <path
                d="M3.71023 16.29C3.61513 16.199 3.50298 16.1276 3.38023 16.08C3.13677 15.98 2.86369 15.98 2.62023 16.08C2.49748 16.1276 2.38534 16.199 2.29023 16.29C2.19919 16.3851 2.12783 16.4972 2.08023 16.62C2.00365 16.8021 1.98273 17.0028 2.0201 17.1968C2.05748 17.3908 2.15147 17.5694 2.29023 17.71C2.38743 17.7983 2.49905 17.8694 2.62023 17.92C2.73993 17.9729 2.86936 18.0002 3.00023 18.0002C3.1311 18.0002 3.26053 17.9729 3.38023 17.92C3.50142 17.8694 3.61303 17.7983 3.71023 17.71C3.84899 17.5694 3.94299 17.3908 3.98036 17.1968C4.01773 17.0028 3.99681 16.8021 3.92023 16.62C3.87264 16.4972 3.80127 16.3851 3.71023 16.29ZM7.00023 8H21.0002C21.2654 8 21.5198 7.89464 21.7073 7.70711C21.8949 7.51957 22.0002 7.26522 22.0002 7C22.0002 6.73478 21.8949 6.48043 21.7073 6.29289C21.5198 6.10536 21.2654 6 21.0002 6H7.00023C6.73502 6 6.48066 6.10536 6.29313 6.29289C6.10559 6.48043 6.00023 6.73478 6.00023 7C6.00023 7.26522 6.10559 7.51957 6.29313 7.70711C6.48066 7.89464 6.73502 8 7.00023 8ZM3.71023 11.29C3.56961 11.1512 3.39104 11.0572 3.19705 11.0199C3.00306 10.9825 2.80234 11.0034 2.62023 11.08C2.49905 11.1306 2.38743 11.2017 2.29023 11.29C2.19919 11.3851 2.12783 11.4972 2.08023 11.62C2.02733 11.7397 2 11.8691 2 12C2 12.1309 2.02733 12.2603 2.08023 12.38C2.13087 12.5012 2.2019 12.6128 2.29023 12.71C2.38743 12.7983 2.49905 12.8694 2.62023 12.92C2.73993 12.9729 2.86936 13.0002 3.00023 13.0002C3.1311 13.0002 3.26053 12.9729 3.38023 12.92C3.50142 12.8694 3.61303 12.7983 3.71023 12.71C3.79856 12.6128 3.86959 12.5012 3.92023 12.38C3.97314 12.2603 4.00047 12.1309 4.00047 12C4.00047 11.8691 3.97314 11.7397 3.92023 11.62C3.87264 11.4972 3.80127 11.3851 3.71023 11.29ZM21.0002 11H7.00023C6.73502 11 6.48066 11.1054 6.29313 11.2929C6.10559 11.4804 6.00023 11.7348 6.00023 12C6.00023 12.2652 6.10559 12.5196 6.29313 12.7071C6.48066 12.8946 6.73502 13 7.00023 13H21.0002C21.2654 13 21.5198 12.8946 21.7073 12.7071C21.8949 12.5196 22.0002 12.2652 22.0002 12C22.0002 11.7348 21.8949 11.4804 21.7073 11.2929C21.5198 11.1054 21.2654 11 21.0002 11ZM3.71023 6.29C3.61513 6.19896 3.50298 6.12759 3.38023 6.08C3.19812 6.00342 2.99741 5.9825 2.80342 6.01987C2.60943 6.05725 2.43086 6.15124 2.29023 6.29C2.2019 6.3872 2.13087 6.49882 2.08023 6.62C2.02733 6.7397 2 6.86913 2 7C2 7.13087 2.02733 7.2603 2.08023 7.38C2.13087 7.50119 2.2019 7.6128 2.29023 7.71C2.38743 7.79833 2.49905 7.86936 2.62023 7.92C2.80234 7.99658 3.00306 8.0175 3.19705 7.98013C3.39104 7.94275 3.56961 7.84876 3.71023 7.71C3.79856 7.6128 3.86959 7.50119 3.92023 7.38C3.97314 7.2603 4.00047 7.13087 4.00047 7C4.00047 6.86913 3.97314 6.7397 3.92023 6.62C3.86959 6.49882 3.79856 6.3872 3.71023 6.29ZM21.0002 16H7.00023C6.73502 16 6.48066 16.1054 6.29313 16.2929C6.10559 16.4804 6.00023 16.7348 6.00023 17C6.00023 17.2652 6.10559 17.5196 6.29313 17.7071C6.48066 17.8946 6.73502 18 7.00023 18H21.0002C21.2654 18 21.5198 17.8946 21.7073 17.7071C21.8949 17.5196 22.0002 17.2652 22.0002 17C22.0002 16.7348 21.8949 16.4804 21.7073 16.2929C21.5198 16.1054 21.2654 16 21.0002 16Z" 
                fill={tables.livebet === currentTable ? "#101111" : '#8C8C8C'}
              />
            </svg>
          </button>

          <button 
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              display: 'flex',
            }}
            onClick={() => setCurrentTable(tables.chat)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{
                backgroundColor: tables.chat === currentTable ? '#66E094' : 'rgba(26, 26, 29, 0.80)',
                borderRadius: '0px 4px 4px 0px',
                padding: '4px',
              }}
            >
              <path 
                d="M17 7H7C6.73478 7 6.48043 7.10536 6.29289 7.29289C6.10536 7.48043 6 7.73478 6 8C6 8.26522 6.10536 8.51957 6.29289 8.70711C6.48043 8.89464 6.73478 9 7 9H17C17.2652 9 17.5196 8.89464 17.7071 8.70711C17.8946 8.51957 18 8.26522 18 8C18 7.73478 17.8946 7.48043 17.7071 7.29289C17.5196 7.10536 17.2652 7 17 7ZM17 11H7C6.73478 11 6.48043 11.1054 6.29289 11.2929C6.10536 11.4804 6 11.7348 6 12C6 12.2652 6.10536 12.5196 6.29289 12.7071C6.48043 12.8946 6.73478 13 7 13H17C17.2652 13 17.5196 12.8946 17.7071 12.7071C17.8946 12.5196 18 12.2652 18 12C18 11.7348 17.8946 11.4804 17.7071 11.2929C17.5196 11.1054 17.2652 11 17 11ZM19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V15C2 15.7956 2.31607 16.5587 2.87868 17.1213C3.44129 17.6839 4.20435 18 5 18H16.59L20.29 21.71C20.3834 21.8027 20.4943 21.876 20.6161 21.9258C20.7379 21.9755 20.8684 22.0008 21 22C21.1312 22.0034 21.2613 21.976 21.38 21.92C21.5626 21.845 21.7189 21.7176 21.8293 21.5539C21.9396 21.3901 21.999 21.1974 22 21V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM20 18.59L17.71 16.29C17.6166 16.1973 17.5057 16.124 17.3839 16.0742C17.2621 16.0245 17.1316 15.9992 17 16H5C4.73478 16 4.48043 15.8946 4.29289 15.7071C4.10536 15.5196 4 15.2652 4 15V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V18.59Z" 
                fill={tables.chat === currentTable ? "#101111" : '#8C8C8C'}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveBetsTracker;
