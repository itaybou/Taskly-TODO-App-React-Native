import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { Notifications, Platform } from 'expo';
import { isANDROID } from '../../data/Constants'

let popup = null;

export const setPopup = (reference) =>
    popup = reference;

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
    if (isANDROID) {
        Notifications.createChannelAndroidAsync('due-tasks', {
            name: 'Tasks',
            priority: 'max',
            sound: true,
            vibrate: true
        });
    }
    Notifications.addListener(handleNotification);
    return true;
};


const handleNotification = ({origin, data}) => {
    if(origin === 'selected') {
        popup.show({
            onPress: function() {console.log('Pressed')},
            appIconSource: require('../../assets/icon.png'),
            appTitle: 'Taskly',
            timeText: 'Now',
            title: 'Your task is due!',
            body: data.title,
            slideOutTime: 3000
        });
        console.info(`Notification (${origin}) with data: ${JSON.stringify(data)}`);
    }
}

export const parseDateFromDDMMYYYYHHmm = (datetimeString) => {
    const datetime = datetimeString + ':00'
    const datetimeArray = datetime.split(' ');
    const date = datetimeArray[0].split(/\-/);
    const time = datetimeArray[1];
    const dateDetails = date[1] + '/' + date[0] + '/' + date[2] + ' ' + time;
    return new Date(dateDetails);
};


export const sendScheduledNotification = async (title, body, data, datetimeString, millisecond_offset) => {
    let notification_id = 'none';
    const parsed_date = parseDateFromDDMMYYYYHHmm(datetimeString).getTime() - millisecond_offset;
    if(parsed_date > 0) {
        const localNotification = {
            title: title,
            body: body,
            data: data,
            channelId: 'due-tasks',
            ios: {
                sound: true,
            },
            android: {
                channelId: 'due-tasks',
                color: 'yellow'
            },
        }
        const schedulingOptions = {
            time: parsed_date
        }
        console.log('Scheduling delayed notification:', { localNotification, schedulingOptions })
        await Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions)
            .then(id => {
                notification_id = id;
            })
            .catch(err => console.error(err))
        console.log(notification_id);
        return notification_id; // If equal to 'none' we have an error.
    } else {
        return 'illegal';
    }
}

export const cancelScheduledNotification = (notification_id) => {
    Notifications.dismissNotificationAsync(notification_id);
    console.log(notification_id);
}