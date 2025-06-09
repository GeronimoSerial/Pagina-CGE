//Modal (quitado en versión final)
"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

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
        <Button
          onClick={() => setOpen(false)}
          className="bg-[#205C3B] hover:bg-[#194931] text-white font-medium px-6 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-[#194931] focus:ring-offset-2"
        >
          Entendido
        </Button>
      </DialogContent>
    </Dialog>
  );
}
