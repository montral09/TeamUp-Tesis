import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {MAIN_URL} from './constants';
import { connect } from 'react-redux';

const PUSH_ENDPOINT = MAIN_URL+'api/deviceToken';

 export default async function registerForPushNotificationsAsync(mail) {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      DeviceToken: token,
      Mail: mail,
    }),
  });
}
