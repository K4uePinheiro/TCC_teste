import { db } from "./firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, getDoc, getDocs, setDoc, addDoc, deleteDoc, collection} from "firebase/firestore"
import type { Product } from "../context/CartContext";

export const addToCart = async ( uid: string, product: any) => {
    await updateDoc(doc(db, "users", uid),{
        cart: arrayUnion(product),
        updateAt: serverTimestamp()
    });
};

export const removeFromCart = async (uid:string, product:any) => {
    await updateDoc(doc(db, "users", uid),{
        cart: arrayRemove(product),
        updateAt :serverTimestamp()
    });
};

//favoritos

export const addToFavorites = async (uid:string, product:any) => {
    await updateDoc(doc(db, "users", uid), {
    favorites: arrayUnion(product),
    updateAt: serverTimestamp()
    });
};

export const removeFromFavorites = async (uid: string, orderData:any ) => {
    await updateDoc(doc(db, "users", uid), {
        orders: arrayUnion({
            ...orderData,
            date: serverTimestamp(),
            status: "pending"
        }),
        updateAt: serverTimestamp()
    });
};

export async function getUserCart(uid: string){
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if(!snap.exists()) return [];

    const data = snap.data();
    return data.cart || [];
}

export async function saveUserCart(uid:string, cart:Product[]) {
    const ref = doc(db,"users", uid);
    await setDoc(ref, {cart }, {merge:true});
    
}

export async function saveAdress(address: any) {
    try {
        const docRef =await addDoc(collection(db, "addresses"), {
            ...address,
        created: new Date(),
        });
        return docRef.id;
    }   catch (error) {
        console.error("Erro ao salvar endereço: ", error);  
        throw error;
    }
}

export async function getAllAddresses() {
    const snapshot = await getDocs(collection(db, "addresses"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data()}));

}

export async function deleteAddress(Id: string) {    
    return await deleteDoc(doc(db, "addresses", Id));
}
export async function updateAddress(Id: string, newData: any) {
    return await updateDoc(doc(db, "addresses", Id), {
        ...newData,
        updated: new Date(), // Adiciona timestamp de atualização
    });
}

export interface Address {
  id?: string;
  nome: string;
    rua: string;
    numero: string;
    estado: string;
    bairro: string;
    cidade: string;
    cep: string;
}