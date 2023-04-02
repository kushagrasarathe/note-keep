import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, notesCollectionRef } from "../configs/firebaseConfig";
import { getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";

function useFetchNotes(collection, pageSize, notesPerPage) {
    const [fetchedData, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            const q = query(
                notesCollectionRef,
                orderBy("title", "asc"),
                limit(notesPerPage),
                startAfter(currentPage * pageSize)
            );

            const snapshot = await getDocs(q);

            if (snapshot.docs.length === 0) {
                setIsLastPage(true);
                return;
            }

            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(prevData => [...prevData, ...newData]);
        };

        fetchData();
    }, [collection, pageSize, currentPage, notesPerPage]);

    const loadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    return { fetchedData, isLastPage, loadMore };
}

export default useFetchNotes;
