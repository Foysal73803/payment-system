export interface AmountType {
    id: string | null,
    amount: number,
    image: any 
};

export interface BetType {
    id: string | null,
    amount: number | null,
    numbers: string | null,
    date: string | null,
    status: string | null,
    winOrLose: string | null
};

export interface Product {
    id: string,
    title: string | null,
    image: any | null,
    description: string | null,
};

export interface WinProduct {
    id: string | null,
    product: Product | null,
    winOrLose: string | null,
    deliveryStatus: string | null;
    winningDate: string | null,
    deliveryAddress: string | null,
    deliveryDate: string | null,
};

export type Transaction = {
    id: string | null;
    title: string | null;
    amount: number | null;
    senderNo: string | null;
    receiverNo: string | null;
    purpose: string | null;
    localDateTime: string | null;
};

export type TransactionRequestType = {
    amount: number;
    receiverNo: string;
    transactionType: string;
};  
