import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialDto } from "@/model";

import { Delete, MoreHorizontal, View } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaterialActionsProps {
  material: MaterialDto;
  setSelectedMaterial: (materialDto: MaterialDto) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

const MaterialActions = ({
  material,
  setSelectedMaterial,
  setIsDeleteDialogOpen,
}: MaterialActionsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="h-4 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black text-white">
          <DropdownMenuItem
            onClick={() => {
              navigate(`/material/${material.id}`);
            }}
          >
            <View className="h-4 w-4 mr-2" />
            view
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedMaterial(material);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Delete className="h-4 w-4 mr-2" />
            delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MaterialActions;
