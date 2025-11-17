"use client";

import React, { useState } from "react";
import ActivitesCard from "./ActivitesCard";
import { FiUserCheck, FiUsers } from "react-icons/fi";
import { GiBowlingPropulsion } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import ActivitesTabs from "../ActivitesTabs/ActivitesTabs";

export default function Activites() {

  return (
    <div>
      
      <ActivitesTabs></ActivitesTabs>
    </div>
  );
}
