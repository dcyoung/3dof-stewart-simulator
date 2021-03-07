import React from "react";
import Settings from "./Settings";

import { Tab, Tabs } from "react-bootstrap";

function Sidebar() {
  return (
    <div>
      <Tabs defaultActiveKey="settings" id="uncontrolled-tab-example">
        <Tab eventKey="settings" title="Settings">
          <Settings/>
        </Tab>
        <Tab eventKey="disabled_example" title="Disabled" disabled>
          Disabled example text...
        </Tab>
      </Tabs>
    </div>
  );
}

export default Sidebar;
