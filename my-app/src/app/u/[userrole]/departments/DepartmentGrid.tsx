"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AiOutlineApartment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineAddCircle } from "react-icons/md";

// Imports from your project structure
import { DeleteDepartmentAction } from "@/app/actions/Department";
import { useDepartments } from "@/Hooks/useDepartments";
import { useAddNewEntity } from "@/context/AddNewEntityProvider";
import { useConfirmationModal } from "@/context/ConfirmationModal";
import { ConfirmationModal } from "@/Components/ConfirmationModal";
import { TokenUserInfosPayload } from "@/GlobalTypes";

export function DepartmentGrid({ userInfos }: { userInfos: TokenUserInfosPayload | undefined }) {
  const { setIsOpenAddNewDepartment } = useAddNewEntity(); // Assuming this opens your Add Modal
  const { setIsConfirmationModalOpen } = useConfirmationModal();
  
  // Use our clean hook
  const { departments, isLoading, mutateDepartments } = useDepartments(userInfos?.id);

  const [departmentToDelete, setDepartmentToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Handler for Deleting ---
  const handleConfirmDelete = async () => {
    if (!userInfos?.id || !departmentToDelete) return;

    setIsDeleting(true);
    try {
      // 1. Call Server Action
      const result = await DeleteDepartmentAction(userInfos.id, departmentToDelete);
      
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      
      toast.success(result.message);
      setDepartmentToDelete("");
      
      // 2. Refresh SWR Data immediately
      mutateDepartments();
      setIsConfirmationModalOpen(false);
      setIsDeleting(false);
    } catch {
      toast.error("An unexpected error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full">
      {/* Confirmation Modal Logic */}
      <ConfirmationModal
        Title={`Are you sure to Delete "${departmentToDelete}" Department ?`}
        WarningMessage="This action cannot be undone."
        ConfirmButtonLabel="Delete"
        isLoadingConfirmation={isDeleting}
        HandelConfirmModal={handleConfirmDelete}
        HandelCancelModal={() => setDepartmentToDelete("")}
        ShowWarningMessage
      />

      {/* Header */}
      <div
        className="w-full flex items-center justify-between"
      >
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Departments <span className="text-neutral-400">({departments.length})</span>
        </h1>
        <button
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-neutral-100 py-1.5 px-3 rounded-lg text-sm"
          onClick={() => setIsOpenAddNewDepartment(true)}
        >
          <MdOutlineAddCircle size={18} />
          Add Department
        </button>
      </div>

      <hr className="mb-4 border-neutral-700/60 mt-3" />

      {/* Grid List */}
      {isLoading ? (
        <div className="w-full grid grid-cols-2 gap-3 pt-10">
          {Array(6).fill(0).map((_, idx) => (
            <div key={idx} className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )
        :
      departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dep, idx) => (
            <div
              key={`${dep}-${idx}`}
              className="group bg-neutral-800 p-1.5 rounded-lg border border-neutral-700/60 hover:border-neutral-700 hover:shadow-md transition-all flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-700/40 border border-neutral-700 text-blue-200 rounded-lg">
                  <AiOutlineApartment size={20} />
                </div>
                <span className="font-medium text-neutral-200">{dep}</span>
              </div>

              <button
                onClick={() => {
                  setDepartmentToDelete(dep);
                  setIsConfirmationModalOpen(true);
                }}
                className="text-red-600 cursor-pointer hover:text-red-500 bg-red-900/40 border border-red-700/60 hover:bg-red-900/60 p-2 rounded-lg transition-colors"
                aria-label="Delete department"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 border border-neutral-700/60 rounded-lg bg-section">
          <div className="text-gray-400 mb-3">
            <AiOutlineApartment size={40} />
          </div>
          <p className="text-gray-500 font-medium">No departments found</p>
          <p className="text-gray-400 text-sm mb-4">Get started by adding a new one</p>
          <button
            onClick={() => setIsOpenAddNewDepartment(true)}
            className="cursor-pointer text-blue-600 hover:underline text-sm font-medium"
          >
            Create your first department
          </button>
        </div>
      )}
    </section>
  );
}