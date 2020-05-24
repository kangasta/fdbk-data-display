import React, { useState, useEffect } from "react";

import ChartContainer, { getChartKey } from "../Components/ChartContainer";
import {
  Paper,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const STATISTICS_URL = "http://localhost:8080/overview?limit=48";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statistics: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    errorTitle: {
      color: theme.palette.error.dark,
    },
  })
);

export type StatisticsType = any[];
export interface StatusType {
  error?: string;
  loading?: string;
}

export const Statistics = (): React.ReactElement => {
  const [statistics, setStatistics] = useState<StatisticsType>([]);
  const [status, setStatus] = useState<StatusType>({
    loading: "Loading statistics",
  });

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(STATISTICS_URL);
        const data = await response.json();
        setStatistics(data.statistics);
        setStatus({});
      } catch (_) {
        setStatus({ error: "Was not able to fetch data from the server." });
      }
    };
    fetchData();
  }, []);

  if (status?.loading) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  if (status?.error) {
    return (
      <Paper className={classes.statistics}>
        <Typography className={classes.errorTitle} variant="h5" component="h2">
          Error
        </Typography>
        <p>{status.error}</p>
      </Paper>
    );
  }

  const charts = statistics
    .filter((i) => i.type === "chart")
    .map((i) => <ChartContainer key={getChartKey(i.payload)} {...i.payload} />);

  return <Paper className={classes.statistics}>{charts}</Paper>;
};
