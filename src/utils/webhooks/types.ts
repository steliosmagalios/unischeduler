export type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  primary_email_address_id: string;
};

export type SessionData = {
  user_id: string;
};
