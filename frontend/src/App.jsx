import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import MyOrders from "./pages/MyOrders";
import Announcements from "./pages/Announcements";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Inspections from "./pages/Inspections";
import Repairs from "./pages/Repairs";
import AddRepair from "./pages/AddRepair";
import EditVehicle from "./pages/EditVehicle";
import Orders from "./pages/Orders";
import Drivers from "./pages/Drivers";
import EditRepair from "./pages/EditRepair";
import AddOrder from "./pages/AddOrder";
import AddDriver from "./pages/AddDriver";
import EditDriver from "./pages/EditDriver";
import OrderDetails from "./pages/OrderDetails";
import AddRoute from "./pages/AddRoute";
import EditOrder from "./pages/EditOrder";
import Issues from "./pages/Issues";
import SetPassword from "./pages/SetPassword";
import RoutesHistory from "./pages/RoutesHistory";
import ResetPassword from "./pages/ResetPassword";
import SetNewPassword from "./pages/SetNewPassword";
import AdminAccountConfig from "./pages/AdminAccountConfig";

const ROLES = {
  Driver: "[ROLE_DRIVER]",
  Admin: "[ROLE_ADMIN]",
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public */}
        <Route path="login" element={<Login />} />
        <Route path="aktywacja" element={<SetPassword />} />
        <Route path="brak-dostepu" element={<Unauthorized />} />
        <Route path="haslo-resetowanie" element={<ResetPassword />} />
        <Route path="haslo-ustaw" element={<SetNewPassword />} />
        <Route path="konfiguracja" element={<AdminAccountConfig />} />

        {/* protected */}
        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route element={<RequireAuth allowedRoles={ROLES.Driver} />}>
            <Route path="moje-zlecenia" element={<MyOrders />} />
          </Route>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Driver, ROLES.Admin]} />}
          >
            <Route path="komunikaty" element={<Announcements />} />
          </Route>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Driver, ROLES.Admin]} />}
          >
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="pojazdy" element={<Vehicles />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="pojazdy/dodaj" element={<AddVehicle />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="pojazdy/edytuj" element={<EditVehicle />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="przeglady" element={<Inspections />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="naprawy" element={<Repairs />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="naprawy/dodaj" element={<AddRepair />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="naprawy/edytuj" element={<EditRepair />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="zlecenia" element={<Orders />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="zlecenia/dodaj" element={<AddOrder />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="zlecenia/edytuj" element={<EditOrder />} />
          </Route>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Driver, ROLES.Admin]} />}
          >
            <Route path="zlecenia/szczegoly" element={<OrderDetails />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="trasy" element={<AddRoute />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="trasy/historia" element={<RoutesHistory />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="kierowcy" element={<Drivers />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="kierowcy/dodaj" element={<AddDriver />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="kierowcy/edytuj" element={<EditDriver />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="zgloszenia" element={<Issues />} />
          </Route>
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
