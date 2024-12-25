import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../components/Loader";

const MedAdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#1E3A8A"], // Blue color
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem] px-4 py-6">
        {/* Dashboard Stats */}
        <div className="w-full flex justify-between flex-wrap">
          {/* Sales Card */}
          <div className="rounded-lg bg-blue-800 p-5 w-[20rem] mt-5 text-white">
            <div className="font-bold rounded-full w-[3rem] bg-blue-500 text-center p-3">
              $
            </div>

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : `$${sales?.totalSales.toFixed(2)}`}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-blue-800 p-5 w-[20rem] mt-5 text-white">
            <div className="font-bold rounded-full w-[3rem] bg-blue-500 text-center p-3">
              C
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-blue-800 p-5 w-[20rem] mt-5 text-white">
            <div className="font-bold rounded-full w-[3rem] bg-blue-500 text-center p-3">
              O
            </div>

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="w-full mt-[4rem] flex justify-center">
          <Chart
            options={state.options}
            series={state.series}
            type="line" // Changed to 'line' for a better trend view
            width="90%" // Adjusted for responsiveness
          />
        </div>

        {/* Orders List */}
        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default MedAdminDashboard;
