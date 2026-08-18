import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import type { PersonType } from "../Models/IPersonType";
import type { IPerson } from "../Models/IPerson";

export const usePeople = (personType: PersonType) => {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<IPerson[]>("/people", {
        params: { personType },
      });

      setPeople(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Failed to load people.");
    } finally {
      setLoading(false);
    }
  }, [personType]);

  const addPerson = async (person: IPerson) => {
    const { data } = await api.post<IPerson>("/people", person);
    return data;
  };

  const updatePerson = async (person: IPerson) => {
    await api.put(`/people/${person.id}`, person);
    await getPeople();
  };

  const uploadImage = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<IPerson>(`/people/${id}/image`, formData);

    await getPeople();
    return data;
  };

  const deletePerson = async (id: number) => {
    await api.delete(`/people/${id}`);
  };

  useEffect(() => {
    getPeople();
  }, [getPeople]);

  return {
    people,
    loading,
    error,
    addPerson,
    updatePerson,
    deletePerson,
    uploadImage,
    refresh: getPeople,
  };
};
