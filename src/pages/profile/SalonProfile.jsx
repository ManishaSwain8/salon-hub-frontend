import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UseGet from "@/hooks/fetch/useGet";
import endpoint from "@/utility/axios";
import FancyMultiSelect from "@/components/ui/Dropdown/FancyMultiSelect";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditService from "../EditService";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// import UseGetProfile from "@/hooks/fetch/useGetProfile";

const CITY = [
  "Bhubneswar",
  "Delhi",
  "Bangarulu",
  "Hydrabad",
  "Mumbai",
  "Kolkata",
];
export default function () {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState([]);
  const SERVICE_DATA = UseGet();
  useEffect(() => {
    async function fetchSalonService() {
      const salonId = localStorage.getItem("salonId");
      if (salonId === undefined) {
        localStorage.removeItem("salonId");
        localStorage.removeItem("userid");
        return navigate("/login");
      }
      const res = await endpoint.get(`/salon/${salonId}`);
      // console.log("result", res.data);
      const results = res?.data?.Services;
      // console.log(results);
      let service_opt = [];
      let i = 0;
      for (let result of results) {
        let renamedObject = Object.assign(
          {},
          {
            id: i++,
            value: result.service_type.replace(/\b\w/g, (c) => c.toUpperCase()),
            label: result.service_type.replace(/\b\w/g, (c) => c.toUpperCase()),
            serviceId: result.serviceId,
            price: null,
            duration: result?.SalonService.duration,
            description: result?.SalonService.description,
            price: result?.SalonService.price,
          }
        );

        service_opt.push(renamedObject);
      }
      setSelectedService(service_opt);
    }
    fetchSalonService();
  }, []);

  const notSelectedServices = SERVICE_DATA.filter((service) => {
    return !selectedService.find(
      (selected) => selected.serviceId === service.serviceId
    );
  });

  return (
    <div>
      <section>
        <div>
          <AddNewService service_data={notSelectedServices} />
        </div>
      </section>
    </div>
  );
}

function AddNewService({ service_data }) {
  const [newSelectedService, setNewSelectedService] = useState([]);
  return (
    <div>
      <FancyMultiSelect
        selected={newSelectedService}
        setSelected={setNewSelectedService}
        options={service_data}
      />

      <Table className="mt-4">
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="w-[30%]">Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newSelectedService?.map((service, idx) => (
            <TableRow key={idx}>
              <TableCell
                className={cn(
                  "font-medium border-l-4",
                  service?.price && service?.duration
                    ? "border-l-green-400"
                    : "border-l-red-400"
                )}
              >
                {service.label}
              </TableCell>
              <TableCell>
                {service?.duration ||
                  "Time take to complete this services in minutes."}
              </TableCell>
              <TableCell>
                {service?.description || "Tell about the service."}
              </TableCell>
              <TableCell className="text-right">
                ₹{service?.price || 0}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <EditService
                    service={service}
                    selected={newSelectedService}
                    setSelected={setNewSelectedService}
                  />
                  <Separator />
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={(e) => {
                      // const variable = service.id;
                      const filteredSelect = newSelectedService?.filter(
                        (item) => item.id !== service.id
                      );

                      setNewSelectedService(filteredSelect);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
