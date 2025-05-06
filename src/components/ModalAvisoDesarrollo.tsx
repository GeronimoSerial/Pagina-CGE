"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export default function ModalAvisoDesarrollo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !sessionStorage.getItem("modalShown")
    ) {
      setOpen(true);
      sessionStorage.setItem("modalShown", "true");
    }
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Sitio en desarrollo!</DialogTitle>
          <DialogDescription>
            Esta página se encuentra en desarrollo. Los contenidos pueden
            variar, estar incompletos o cambiar sin previo aviso. Gracias por tu
            comprensión.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
