package nz.exposurewatch.api.xposedornot;

import java.util.List;

public record XposedOrNotBreach(
        String name,
        List<String> dataClasses
) {
}
