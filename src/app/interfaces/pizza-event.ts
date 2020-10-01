export interface PizzaEvent {
    _id?: string;
    title: string;
    description: string;
    presenter: any;
    date: Date;
    duration: any;
    placesLeft: number;
    subscribers?: any[];
    waitingList?: any[];
    isSubscribed?: boolean
}
