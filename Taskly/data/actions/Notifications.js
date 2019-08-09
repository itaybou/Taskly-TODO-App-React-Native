import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo';

export const askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (!Constants.isDevice || existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return false;
    }
    Notifications.addListener(handleNotification);
    return true;
};

handleNotification = ({origin, data}) => {
    console.info(`Notification (${origin}) with data: ${JSON.stringify(data)}`)
}

export const parseDateFromDDMMYYYYHHmm = (datetimeString) => {
    const datetime = datetimeString + ':00'
    const datetimeArray = datetime.split(' ');
    const date = datetimeArray[0].split(/\-/);
    const time = datetimeArray[1];
    const dateDetails = date[1] + '/' + date[0] + '/' + date[2] + ' ' + time;
    return new Date(dateDetails);
};


export const sendScheduledNotification = (title, body, data, datetimeString) => {
    let notification_id = 'none';
    const parsed_date = parseDateFromDDMMYYYYHHmm(datetimeString).getTime();
    if(parsed_date > Date.now()) {
        const localNotification = {
            title: title,
            body: body,
            data: data
        }
        const schedulingOptions = {
            time: parsed_date
        }
        console.log('Scheduling delayed notification:', { localNotification, schedulingOptions })
        Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
            .then(id => notification_id = id)
            .catch(err => console.error(err))
        return notification_id; // If equal to 'none' we have an error.
    } else return 'illegal';
}

export const cancelScheduledNotification = (notification_id) => {
    Notifications.dismissNotificationAsync(notification_id);
}