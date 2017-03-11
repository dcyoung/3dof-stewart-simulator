import React from "react";
import MechanicalSettings from "./MechanicalSettings";
import MiscSettings from "./MiscSettings";

import { Tab, Tabs } from "react-bootstrap";

function Sidebar() {
  return (
    <div>
      <Tabs defaultActiveKey="mechanical" id="uncontrolled-tab-example">
        <Tab eventKey="mechanical" title="Mechanical">
        <MechanicalSettings/>
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <MiscSettings/>
        </Tab>
        <Tab eventKey="disabled_example" title="Disabled" disabled>
          Disabled example text...
        </Tab>
      </Tabs>
    </div>
  );
}

export default Sidebar;
