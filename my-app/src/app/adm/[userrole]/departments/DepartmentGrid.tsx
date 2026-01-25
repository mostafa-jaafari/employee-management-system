"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AiOutlineApartment } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { MdOutlineAddCircle } from "react-icons/md";

// Imports from your project structure
import { DeleteDepartment } from "@/app/actions/Department";
import { useDepartments } from "@/Hooks/useDepartments";
import { useUserInfos } from "@/context/UserInfos";
import { useAddNewEmployer } from "@/context/AddNewEmployer";
import { useConfirmationModal } from "@/context/ConfirmationModal";
import { ConfirmationModal } from "@/Components/ConfirmationModal";

export function DepartmentGrid() {
  const { userInfos, isLoadingUserInfos } = useUserInfos();
  const { setIsOpenAddNewDepartment } = useAddNewEmployer(); // Assuming this opens your Add Modal
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
      const result = await DeleteDepartment(userInfos.id, departmentToDelete);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setDepartmentToDelete("");
      setIsConfirmationModalOpen(false);

      // 2. Refresh SWR Data immediately
      mutateDepartments(); 

    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Loading State ---
  if (isLoading || isLoadingUserInfos) {
    return (
      <div className="w-full grid grid-cols-2 gap-3 pt-10">
        {Array(6).fill(0).map((_, idx) => (
          <div key={idx} className="w-full h-14 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Confirmation Modal Logic */}
      <ConfirmationModal
        Title={`Delete "${departmentToDelete}"?`}
        WarningMessage="This action cannot be undone."
        ConfirmButtonLabel="Delete"
        isLoadingConfirmation={isDeleting}
        HandelConfirmModal={handleConfirmDelete}
        HandelCancelModal={() => setDepartmentToDelete("")}
        ShowWarningMessage
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg text-gray-700">
          Departments <span className="text-gray-400 text-sm">({departments.length})</span>
        </h1>
        <button
          onClick={() => setIsOpenAddNewDepartment(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
        >
          <MdOutlineAddCircle size={18} />
          Add Department
        </button>
      </div>

      <hr className="mb-4 border-gray-200" />

      {/* Grid List */}
      {departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dep, idx) => (
            <div
              key={`${dep}-${idx}`}
              className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <AiOutlineApartment size={20} />
                </div>
                <span className="font-medium text-gray-700">{dep}</span>
              </div>

              <button
                onClick={() => {
                  setDepartmentToDelete(dep);
                  setIsConfirmationModalOpen(true);
                }}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                aria-label="Delete department"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <div className="text-gray-400 mb-3">
            <AiOutlineApartment size={40} />
          </div>
          <p className="text-gray-500 font-medium">No departments found</p>
          <p className="text-gray-400 text-sm mb-4">Get started by adding a new one</p>
          <button
            onClick={() => setIsOpenAddNewDepartment(true)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Create your first department
          </button>
        </div>
      )}
    </section>
  );
}