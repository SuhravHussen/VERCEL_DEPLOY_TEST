import { useState, useCallback, useEffect } from "react";
import { IELTSExamModel } from "@/types/exam/ielts-academic/exam";
import { Currency } from "@/types/currency";

interface UseExamDataReturn {
  examData: Partial<IELTSExamModel>;
  updateExamData: (updates: Partial<IELTSExamModel>) => void;
  resetExamData: () => void;
}

const getInitialExamData = (): Partial<IELTSExamModel> => ({
  title: "",
  description: "",
  price: 0,
  is_free: true,
  currency: Currency.USD,
  lrw_group: {
    exam_date: "",
    listening_time_start: "",
    reading_time_start: "",
    writing_time_start: "",
    assigned_instructors: [],
  },
  speaking_group: {
    time_windows: [],
    assigned_instructors: [],
    session_per_student: 30,
  },
  is_active: true,
  max_students: 50,
});

export const useExamData = (
  initialData?: Partial<IELTSExamModel>
): UseExamDataReturn => {
  const [examData, setExamData] = useState<Partial<IELTSExamModel>>(() => {
    if (initialData) {
      return { ...getInitialExamData(), ...initialData };
    }
    return getInitialExamData();
  });

  // Update examData when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setExamData({ ...getInitialExamData(), ...initialData });
    }
  }, [initialData]);

  const updateExamData = useCallback((updates: Partial<IELTSExamModel>) => {
    setExamData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetExamData = useCallback(() => {
    const resetData = initialData
      ? { ...getInitialExamData(), ...initialData }
      : getInitialExamData();
    setExamData(resetData);
  }, [initialData]);

  return {
    examData,
    updateExamData,
    resetExamData,
  };
};
