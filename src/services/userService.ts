import { db } from "./firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, getDoc, setDoc} from "firebase/firestore"
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