import { MasterProduct } from "../../types/receiving.types";

type AddMasterProductDialogProps = {
  onCreated: (product: MasterProduct) => void | Promise<void>;
};

export function AddMasterProductDialog() {}
