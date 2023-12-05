# family_tree
## Instruction To run the file
1: Do npm install Step 
2: Do npm install inside frontend 
Step 3: Do "npm run dev" to run the file

## Steps to Follow in Client
1: Type each command and submit to create the person or add relationship
2: Toastify is added to check whether the person is created or relationship is added or not.
3: when 'show_tree' command is submitted, a textArea with the family tree will be shown.

### **Installing Redis Server**
On Debian-based Linux distros, follow these instructions:

**From the *Terminal*, execute the following steps to install Redis server:**

1. Add the Redis server APT Repository

```
$ sudo apt-add-repository ppa:chris-lea/redis-server
```

2. Install the Redis server and client utilities

```
$ sudo apt update
$ sudo apt install redis-server
```

**Test if the installation went through fine:**

Type in the following command in the *Terminal*:

```
$ redis-cli ping
```

If the Redis server was installed succesfully, you should see the following response:

```
PONG
```

**Setting up Redis Server:**

We need to make sure that Background saving doesn't fail with a fork() error, so type in the following command in the _Terminal_:

```
$ echo 'vm.overcommit_memory = 1' >> /etc/sysctl.conf
$ sysctl vm.overcommit_memory=1
```

You can read more about this here: https://redis.io/topics/faq (search for 'overcommit')

By default keyspace event notifications are disabled. Notifications are enabled using the notify-keyspace-events of redis.conf or via the CONFIG SET.

redis.conf file can be found in `/etc/redis/redis.conf`

Look for `notify-keyspace-events` and set it to `KEA` as shown below:

```
notify-keyspace-events "KEA"
```

You can read more about this here: https://redis.io/topics/notifications

Restart the Redis Server