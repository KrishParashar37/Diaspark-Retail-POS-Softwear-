with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

main_idx = -1
for i, line in enumerate(lines):
    if line.strip() == 'if __name__ == "__main__":':
        main_idx = i
        break

if main_idx != -1:
    main_block = lines[main_idx:main_idx+6] # 6 lines of main block
    
    # Check if the route is after main block
    route_after_main = False
    for i in range(main_idx+6, len(lines)):
        if "def payments_report():" in lines[i]:
            route_after_main = True
            break
            
    if route_after_main:
        # The route is after main. We need to extract the route code and put main at the end
        route_code = "".join(lines[main_idx+6:])
        
        new_lines = lines[:main_idx] + [route_code] + ['\n'] + main_block
        
        with open('app.py', 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Fixed app.py by moving main block to the end")
    else:
        print("Route not after main block")
else:
    print("Main block not found")
