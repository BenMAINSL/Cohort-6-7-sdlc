import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import type { PersonType } from "../Models/IPersonType";
import type { IPerson } from "../Models/IPerson";

export const usePeople = (personType: PersonType) => {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //LESSOMN 1 APIs

  // When naming functions:
  // - Use camelCase
  // - Give the function a meaningful name
  // - The name should describe what the function does

  //This function is used to fetch all the people(students and Employees) from our API.

  const getPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      //We need to communicate with our API to retrieve the list of people.
      //Hint Which HTTP request should we use when retrieving data?
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

  //1

  //This function will be used to submit a new person (Student or Employee)

  const functionName = async (person: IPerson) => {
    // This is responsible for communicating with the API using the appropriate HTTP request.
    const { data } = await api.httpmethod<IPerson>("/people", person);
    await getPeople();
    return data;
  };

  //2

  //This fuction is responsible for modifying an already existing person (Student or Employee)

  const fuctionName = async (person: IPerson) => {
    // This is responsible for communicating with the API using the appropriate HTTP request.
    await api.httpmethod(`/people/${person.id}`, person);
    await getPeople();
  };

  //3

  //This function is responsible for adding an image to a specific person (Student or Employee)
  const functionName = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // This is responsible for communicating with the API using the appropriate HTTP request.
    const { data } = await api.httpmethod<IPerson>(
      `/people/${id}/image`,
      formData,
    );

    await getPeople();
    return data;
  };

  //4
  //This Function is responsible for removing a person from the API

  const functionName = async (id: number) => {
    // This is responsible for communicating with the API using the appropriate HTTP request.
    await api.htttpmethod(`/people/${id}`);
    await getPeople();
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
