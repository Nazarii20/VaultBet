import React, { useState, useEffect } from "react";
import { useConnect } from "@connect2ic/react";
import mainnetCanisterIds from "@misc/mainnetCanisterIds";
import { useBankActor } from "src/hooks/useBankActor";
import useLedgerActor from "src/hooks/useLedgerActor";
import useWICPLedgerActor from "src/hooks/useWICPLedgerActor";
import useCKBTCLedgerActor from "src/hooks/useCKBTCLedgerActor";
import useVBTLedgerActor from "src/hooks/useVBTLedgerActor";
import { Token } from '@declarations/bank';
import { theme } from '@misc/theme';
import CurrencyDropdown from 'src/modules/Arcade/arcadeComponents/CurrencyDropdown';
import { useArcadeContext } from "@context/ArcadeContext";
import { Usergeek } from "usergeek-ic-js"
import { depositDIP20, depositICRC } from "../helpers/depositFunctions";
import { withdrawDIP20, withdrawICRC } from "../helpers/withdrawFunctions";

import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import { decimals } from "@utils/validationHelper";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CustomButton from "../Games/RideTheBus/components/CustomButton/CustomButton";
import { panelsLight } from "../Games/RideTheBus/utils/variables";



const ArcadeNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [transferType, setTransferType] = useState("");
  const { activeProvider, principal } = useConnect();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currency, currencyDetails, userData, setUserData, checkBalance } = useArcadeContext();
  const loadingBalance = localStorage.getItem('loadingArcadeBalance')
  const bankCanisterId = mainnetCanisterIds.bankCanisterId;
  const ckbtcLedgerActor = useCKBTCLedgerActor();
  const vbtLedgerActor = useVBTLedgerActor();

  const ledgerActor = useLedgerActor();
  const bankActor = useBankActor();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ledgerActors: Record<string, any> = {
    "CKBTC": ckbtcLedgerActor,
    "WICP": ledgerActor,
    "VBT": vbtLedgerActor
  };
  const wicpLedger = useWICPLedgerActor();

  const getArcadeBalance = async (currency: string) => {
    localStorage.setItem('loadingArcadeBalance', 'true');
    const token = { [currency]: BigInt(0) };
    // console.log("bankActor", bankActor);
    const balance = await bankActor.getBalance(token as Token);
    // console.log("balance", balance);
    const newUserData = {
      ...userData,
      balance: Number(balance) / decimals,
      principalId: principal,
    }

    setUserData(newUserData);
    localStorage.setItem('loadingArcadeBalance', 'false');
  }

  useEffect(() => {
    if (checkBalance % 5 === 0) {
      try {
        getArcadeBalance(currency);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }, [activeProvider, currency, bankActor, checkBalance]);

  const openTransferMenu = (type: string) => {
    setOpen(true);
    setTransferType(type);
  };

  const closeTransferMenu = () => {
    setOpen(false);
    setTransferType("");
    setProcessing(false);
    setSuccess(null);
    setAmount(0);
  };

  const transferFunction: {
    [key: string]: (
      amount: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bankActor: any,
      currency: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ledgerActor: any,
      principal: string,
      bankCanisterId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      DIP20Ledger: any,
    ) => Promise<boolean>;
  } = {
    deposit: currency === "WICP" ? depositDIP20 : depositICRC,
    withdraw: currency === "WICP" ? withdrawDIP20 : withdrawICRC,
  };

  const handleChange = (text: string) => {
    const numberRegex = /^[0-9]*(\.[0-9]+)?$/; // Regex pattern for a valid number
    let parsedValue;
    if (text.match(numberRegex)) {
      parsedValue = parseFloat(text);
      setAmount(parsedValue);
    } else if (text === "") {
      parsedValue = 0;
      setAmount(parsedValue);
    }
  };

  const handleTransfer = async () => {
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setProcessing(true);

    // Perform your transfer function here
    console.log('Begin Transfer Function ' + transferType)
    const transferFunctionResult = await transferFunction[transferType](amount, bankActor, currency, ledgerActors[currency], String(principal), bankCanisterId, wicpLedger);
    console.log('Transfer Function : ' + transferFunction)
    console.log('Transfer Function Result : ' + transferFunctionResult)
    setProcessing(false); // Stop processing
    Usergeek.trackEvent("Arcade " + transferType)
    setSuccess(transferFunctionResult);

    setTimeout(() => {
      setOpen(false);
      setSuccess(null);
      setAmount(0);
    }, 2000);
  };

  var walletConnected = false
  if (activeProvider) {
    walletConnected = true
  }


  return (
    <AppBar
      position="static"
      sx={{
        padding: "5px",
        background: "none",
        borderRadius: "10px",
        boxShadow: "none",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4}>
          <Toolbar
            className="side_header"
            sx={{ justifyContent: "space-between" }}
          >
            <div
              className="balance-container"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Typography variant="h6" component="div" sx={{ whiteSpace: 'nowrap' }}>
                {loadingBalance === 'true' ? (<CircularProgress />) : userData.balance.toPrecision(currencyDetails.precision)}
              </Typography>
              <CurrencyDropdown />
            </div>
            <Box
              sx={{ display: "flex", gap: '8px', alignItems: "center" }}
              className="arcade_btn"
            >
              <CustomButton
                backgroundColor={panelsLight}
                paddingBlock="8"
                paddingInline="24"
                paddingBlockMobile="4"
                paddingInlineMobile="8"
                isBorderExist={true}
                borderRadius="8"
                borderRadiusMobile="8"
                fontSizeMobile="12"
                onClick={() => openTransferMenu("deposit")}
              >
                Deposit
              </CustomButton>
              <CustomButton
                backgroundColor={panelsLight}
                paddingBlock="8"
                paddingInline="24"
                paddingBlockMobile="4"
                paddingInlineMobile="8"
                isBorderExist={true}
                borderRadius="8"
                borderRadiusMobile="8"
                fontSizeMobile="12"
                onClick={() => openTransferMenu("withdraw")}
              >
                Withdraw
              </CustomButton>
            </Box>
          </Toolbar>
        </Grid>
      </Grid>

      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "375px",
            },
          },
        }}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.thirdColor.main,
            boxShadow: "none",
          },
        }}
        open={open}
        onClose={closeTransferMenu}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              {" "}
              <Typography
                color={"white"}
                variant="subtitle1"
                sx={{ textAlign: "left", marginBottom: "5px" }}
              >
                {transferType === "deposit"
                  ? `Deposit ${currencyDetails.displayCurrency}`
                  : currency === "VBT" ? `Withdraw ${currencyDetails.displayCurrency} (100 VBT = 1 ICP)` : `Withdraw ${currencyDetails.displayCurrency}`}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={closeTransferMenu}>
                <CloseRoundedIcon sx={{ color: "grey" }} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative" }}>
            <TextField
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => handleChange(e.target.value)}
              inputProps={{ min: 0, step: '0.01' }}
              sx={{
                input: { color: "white" },
                background: "#2e2e2e",
                borderRadius: "10px",
              }}
            />
            <span
              className="dialog-currency-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
              }}

            // sx={{
            //   borderRadius: "0px 10px 10px 0px",
            //   position: "absolute",
            //   top: "50%",
            //   right: "0",
            //   transform: "translateY(-50%)",
            //   padding: "8px",
            //   height: "100%",
            //   width: "20px",
            // }}
            >
              <CurrencyDropdown />
            </span>
          </Box>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {processing && (
              <CircularProgress sx={{ marginTop: "20px" }} color="warning" />
            )}
            {success !== null && (
              <span style={{ fontSize: "24px", marginTop: "20px", color: success ? "green" : "red" }}>
                {success ? "\u2713" : "\u2718"}
              </span>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={processing || !walletConnected}
            onClick={
              handleTransfer
            }
            color="primary"
            sx={{
              backgroundColor:
                transferType === "deposit" ? "#00AA25" : "#C00000",
              textTransform: "none",
              fontWeight: 700,
              width: "100%",
              margin: "10px",
              // marginRight: '100px',
              color: "white",
              "&:hover": {
                backgroundColor:
                  transferType === "deposit" ? "success.dark" : "error.dark",
              },
            }}
          >
            {walletConnected ? (transferType === "deposit" ? "Deposit" : "Withdraw") : "Please login"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>

  );
};

export default ArcadeNavbar;
