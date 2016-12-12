package com.michielroos.bitbucket.handler; /**
 * Copyright notice
 *
 * ⓒ 2016 Michiel Roos <michiel@michielroos.com>
 * All rights reserved
 *
 * This script is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 */

import com.atlassian.bitbucket.io.LineReader;
import com.atlassian.bitbucket.io.LineReaderOutputHandler;
import com.atlassian.bitbucket.scm.CommandOutputHandler;
import com.atlassian.utils.process.Watchdog;

import java.io.IOException;

public class StringOutputHandler extends LineReaderOutputHandler implements CommandOutputHandler<String> {
    private final StringBuilder stringBuilder;
    private Watchdog watchdog;

    /**
     * Constructor
     */
    public StringOutputHandler() {
        super("UTF-8");

        stringBuilder = new StringBuilder();
    }

    /**
     * Gets command output
     *
     * @return command output
     */
    public String getOutput() {
        return stringBuilder.toString();
    }

    /**
     * Sets watchdog
     *
     * @param watchdog watchdog
     */
    @Override
    public void setWatchdog(Watchdog watchdog) {
        this.watchdog = watchdog;
    }

    /**
     * Line for line processing of command output
     *
     * @param reader line reader
     */
    @Override
    public void processReader(LineReader reader) {
        try {
            String line;

            if (watchdog != null) {
                watchdog.resetWatchdog();
            }

            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
                stringBuilder.append("\n");
            }
        } catch (IOException e) {
        }
    }
}