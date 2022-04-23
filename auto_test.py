import time
import os
import datetime
import platform

log = print
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler


class AutoTest(PatternMatchingEventHandler):
    patterns = [
        # "*.py",
        "*.gua",
        "*.a16",
        "*.js",
    ]

    def process(self, event):
        log('auto test', os.getcwd())
        log(datetime.datetime.now().strftime("%Y/%m/%d %I:%M:%S %p"))
        self.run_test_guas()

    @staticmethod
    def run_test_guas():
        # os_name = platform.platform()
        # if os_name == 'Windows':
        #     gualang = 'chcp 65001 && c:\\gualang_ide\\portable-data\\data\\user-data\\gualang\\gualang.exe'
        # else:
        #     gualang = '/Applications/gualang/code-portable-data/user-data/gualang/gualang.mac'
        # cmd = '{} nosetests.gua'.format(gualang)
        cmd = 'node type-inference.js'
        os.system(cmd)


    def on_modified(self, event):
        self.process(event)


def main():
    path = '.'
    observer = Observer()
    observer.schedule(AutoTest(), path=path, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()


if __name__ == '__main__':
    main()
